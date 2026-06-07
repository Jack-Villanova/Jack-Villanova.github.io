const MAINTENANCE_MODE = true;

const isLocal =
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1" ||
    location.hostname === "";

if (
    MAINTENANCE_MODE &&
    !isLocal &&
    !location.pathname.endsWith("maintenance.html")
) {
    location.replace("/maintenance.html");
}