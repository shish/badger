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

        # The end goal is to have a white space outside the cutter-circle
        # (semi-transparent in dev mode to see a hint of what's being cut
        # off; solid white in print mode to avoid printing anything outside)
        #
        #   123| design |321
        #
        # svg doesn't have "stroke outside the cutter circle" (where the
        # cutter circle is "|" and the stroke is 123), so we need to
        # make make a border circle which is larger than the cutter circle
        # (2), and then stroke both sides of the border (1/3)...
        #
        # Also, some printers (and, weirdly, libreoffice) can't handle shaped
        # semitransparent masks, which is why we can't white-out outside the
        # border using a mask
        big_r = (w**2 + h**2)**0.5 / 2
        big_r_stroke = (big_r * 2) - self.cutter_size
        # badge sides are a circle half way between the visible circle and
        # the cutter circle, stroked wide enough to cover the gap between
        # the two
        small_r = (self.cutter_size + self.visible_size) / 4
        small_r_stroke = (self.cutter_size - self.visible_size) / 2
        return f"""
<svg
    width="{w * self.print_scale}mm"
    height="{h * self.print_scale}mm"
    viewBox="0 0 {w} {h}"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
>
    <defs>
    </defs>
    <g>
        <rect x="0" y="0" width="{w}" height="{h}" fill="{self.background}" />
        {inner}
        <text x="0" y="-1" font-size="2">
          <textPath
            xlink:href="#side"
            method="stretch"
            textLength="100%"
            spacing="auto"
            lengthAdjust="spacingAndGlyphs"
          >
            ALL THESE SQUARES MAKE A CIRCLE
          </textPath>
        </text>
        <circle cx="{cx}" cy="{cy}" r="{big_r}" stroke="white" class="outsideCutter" stroke-width="{big_r_stroke}" fill="none" />
        <circle cx="{cx}" cy="{cy}" r="{small_r}" stroke="white" class="badgeSideArea" stroke-width="{small_r_stroke}" fill="none" />
        <circle id="side" cx="{cx}" cy="{cy}" r="{self.visible_size/2}" stroke="black" class="badgeSideMarker" stroke-width="0.5" stroke-dasharray="2,2" fill="none" />
        <circle cx="{cx}" cy="{cy}" r="{self.cutter_size/2}" stroke="black" stroke-width="1" fill="none" />
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
            .outsideCutter {{
                opacity: 0.85;
            }}
            .badgeSideArea {{
                opacity: 0.50;
            }}
            .badgeSideMarker {{
                opacity: 0.75;
            }}
            @media print {{
                .outsideCutter {{
                    opacity: 1.0;
                }}
                .badgeSideArea {{
                    display: none;
                }}
                .badgeSideMarker {{
                    display: none;
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
