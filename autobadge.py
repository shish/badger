#!/usr/bin/env python3

import typing as t
import logging
import enum
import sys
import argparse
import tomllib


log = logging.getLogger(__name__)


class Page(enum.Enum):
    A4 = "A4"
    Letter = "Letter"

class Badge:
    def __init__(self, print_scale: float=1.0):
        self.id = id(self)
        self.background = "white"
        self.canvas_size = 43
        self.cutter_size = 41
        self.visible_size = 34
        self.print_scale = print_scale

    def render(self, inner: t.Optional[str] = None) -> str:
        w = self.canvas_size
        h = self.canvas_size
        cx = w / 2
        cy = h / 2
        return f"""
<svg
    width="{w * self.print_scale}mm"
    height="{h * self.print_scale}mm"
    viewBox="0 0 {w} {h}"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
>
    <defs>
        <mask id="maskCanvas">
            <rect x="0" y="0" width="{w}" height="{h}" fill="white" />
        </mask>
        <mask id="maskOutsideCutter">
            <rect x="0" y="0" width="{w}" height="{h}" fill="white" />
            <circle cx="{cx}" cy="{cy}" r="{self.cutter_size/2}" fill="black" />
        </mask>
        <mask id="maskBadgeSides">
            <rect x="0" y="0" width="{w}" height="{h}" fill="black" />
            <circle cx="{cx}" cy="{cy}" r="{self.cutter_size/2}" fill="white" />
            <circle cx="{cx}" cy="{cy}" r="{self.visible_size/2}" fill="black" />
        </mask>
    </defs>
    <g mask="url(#maskCanvas)">
        <rect x="0" y="0" width="{w}" height="{h}" fill="{self.background}" />
        {inner}
        <rect x="0" y="0" width="{w}" height="{h}" fill="white" class="whiteOutsideCutter" mask="url(#maskOutsideCutter)" />
        <rect x="0" y="0" width="{w}" height="{h}" fill="white" class="whiteBadgeSides" mask="url(#maskBadgeSides)" />
        <circle cx="{cx}" cy="{cy}" r="{self.cutter_size/2}" stroke="black" stroke-width="1" fill="none" />'
    </g>
</svg>
"""

class ImageBadge(Badge):
    def __init__(self,
        image: str,
        bg: str,
        offset: t.Tuple[int, int] = (0, 0),
        print_scale: float=1.0,
        img_scale: float=1.0,
    ):
        super().__init__(print_scale)
        self.image = image
        self.background = bg
        self.img_offset = offset
        self.img_scale = img_scale

    def render(self, inner: t.Optional[str] = None) -> str:
        centre = self.canvas_size / 2
        img_size = self.canvas_size * self.img_scale
        img_offset = (
            (centre - img_size / 2) + self.img_offset[0],
            (centre - img_size / 2) + self.img_offset[1]
        )
        return super().render(f'<image href="{self.image}" x="{img_offset[0]}" y="{img_offset[1]}" width="{img_size}" height="{img_size}" />')

class Sheet:
    def __init__(
        self,
        badges: t.List[Badge]=[],
        print_scale: float=1.0,
    ):
        self.badges = badges
        self.print_scale = print_scale

    def render(self) -> str:
        return f"""<html>
    <head>
        <title>Test</title>
        <style type="text/css">
            .whiteOutsideCutter {{
                opacity: 0.75;
            }}
            .whiteBadgeSides {{
                opacity: 0.25;
            }}
            @media print {{
                .whiteOutsideCutter {{
                    opacity: 1.0;
                }}
                .whiteBadgeSides {{
                    opacity: 0.0;
                }}
            }}
        </style>
    </head>
    <body>
    <svg
        width="{100 * self.print_scale}mm"
        height="1mm"
        viewBox="0 0 {100 * self.print_scale} 1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
    >
        <rect x="0" y="0" width="{100 * self.print_scale}" height="1" fill="black" />
    </svg> 100mm ({100 * self.print_scale}%)
    <br/>
{"\n".join(badge.render() for badge in self.badges)}
    </body>
</html>"""

def main(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", "-o", type=argparse.FileType("w"), default=sys.stdout)
    parser.add_argument("--verbose", "-v", action="store_true")
    parser.add_argument("config", type=argparse.FileType("rb"), help="Path to TOML config file")
    args = parser.parse_args(argv)

    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO)

    # Load badge configuration from TOML file
    try:
        config = tomllib.load(args.config)
        print_config = config.get("print", {})
        print_scale = print_config.get("scale", 1.0)
        badges = []

        # Process badges from config
        for badge_config in config.get("badges", []):
            img = badge_config.get("image", "")
            bg = badge_config.get("background", "#ffffff")
            offset_x = badge_config.get("offset_x", 0)
            offset_y = badge_config.get("offset_y", 0)
            scale = badge_config.get("scale", 1.0)
            count = badge_config.get("count", 1)

            # Add the specified number of this badge type
            badges.extend([ImageBadge(img, bg, (offset_x, offset_y), print_scale=print_scale, img_scale=scale)] * count)

        s = Sheet(badges, print_scale=print_scale)
    except Exception as e:
        log.error(f"Error loading TOML config file: {e}")
        return 1
    args.output.write(s.render())

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
