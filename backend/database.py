import os
import socket
from pathlib import Path
from urllib.parse import urlparse

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from typing import Optional

load_dotenv(Path(__file__).parent / ".env")

DATABASE_URL: str = os.environ["DATABASE_URL"]

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)
elif DATABASE_URL.startswith("postgresql://") and not DATABASE_URL.startswith("postgresql+"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)


def resolve_host_ip(hostname: str) -> Optional[str]:
    """Safely resolve hostname, falling back to public DNS (8.8.8.8) if local DNS blocks it."""
    # 1. Try system standard DNS resolution
    try:
        return socket.gethostbyname(hostname)
    except (socket.gaierror, OSError):
        pass

    # 2. Try querying public DNS 8.8.8.8 / 1.1.1.1 via UDP port 53
    dns_servers = ["8.8.8.8", "1.1.1.1"]
    for dns_server in dns_servers:
        try:
            packet = b"\xaa\xbb\x01\x00\x00\x01\x00\x00\x00\x00\x00\x00"
            for part in hostname.split("."):
                packet += bytes([len(part)]) + part.encode("ascii")
            packet += b"\x00\x00\x01\x00\x01"  # Type A, Class IN

            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.settimeout(2.5)
            sock.sendto(packet, (dns_server, 53))
            data, _ = sock.recvfrom(1024)
            sock.close()

            # Parse IPv4 address from response
            if len(data) >= 16:
                for i in range(len(data) - 4, 12, -1):
                    ip = socket.inet_ntoa(data[i : i + 4])
                    if ip.startswith("3.") or ip.startswith("52.") or ip.startswith("13.") or not ip.startswith("0."):
                        return ip
        except Exception:
            continue

    # 3. Known fallback IPs for Neon AWS Singapore pooler
    if "neon.tech" in hostname:
        return "52.76.212.156"

    return None


connect_args = {}
try:
    parsed = urlparse(DATABASE_URL)
    if parsed.hostname:
        resolved_ip = resolve_host_ip(parsed.hostname)
        if resolved_ip:
            connect_args["hostaddr"] = resolved_ip
except Exception:
    pass

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

