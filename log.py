import logging

logger = logging.getLogger(__name__)
logging.basicConfig(
    filename="test.log",
    encoding="utf-8",
    level=logging.DEBUG,
    format='[%(asctime)s] %(levelname)s: %(message)s',
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger.debug("hello world")
logger.info("info lol")
logger.warning("warning")
logger.error("error")