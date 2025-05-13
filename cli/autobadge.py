#!/usr/bin/env python3

import typing as t
import logging
import enum
import sys
import argparse
import yaml

from badger.sheet import Sheet
from badger.badge import Badge
from badger.layers.solid import Solid
from badger.layers.image import Image
from badger.layers.edgetext import EdgeText
from badger.layers.hflag import HFlag

log = logging.getLogger(__name__)


def main(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", "-o", type=argparse.FileType("w"), default=sys.stdout)
    parser.add_argument("--verbose", "-v", action="store_true")
    parser.add_argument("config", type=argparse.FileType("rb"), help="Path to TOML config file")
    args = parser.parse_args(argv)

    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO)

    # Load badge configuration from TOML file
    try:
        config = yaml.safe_load(args.config)
        print_config = config.get("print", {})
        print_scale = print_config.get("scale", 1.0)
        badges = []

        # Process badges from config
        for badge_config in config.get("badges", []):
            count = badge_config.get("count", 1)

            layers = []
            for layer in badge_config.get("layers"):
                if layer.get("type") == "solid":
                    color = layer.get("color", "white")
                    layers.append(Solid(color))
                elif layer.get("type") == "image":
                    img = layer.get("image", "")
                    offset_x = layer.get("offset_x", 0)
                    offset_y = layer.get("offset_y", 0)
                    scale = layer.get("scale", 1.0)
                    layers.append(Image(img, (offset_x, offset_y), scale))
                elif layer.get("type") == "edge-text":
                    text = layer.get("text", "")
                    startOffset = layer.get("startOffset", 0.0)
                    layers.append(EdgeText(text, startOffset))
                elif layer.get("type") == "hflag":
                    stripes = layer.get("stripes", [])
                    layers.append(HFlag(stripes))
                else:
                    log.error(f"Unknown layer type: {layer.get('type')}")
                    continue

            badges.extend([Badge(layers=layers, print_scale=print_scale)] * count)

        s = Sheet(badges, print_scale=print_scale)
    except Exception as e:
        log.error(f"Error loading config file: {e}")
        return 1
    args.output.write(s.render())

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
