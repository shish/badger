import typing as t
import logging
import enum
import sys
import argparse
import tomllib

from badger.badge import Badge

log = logging.getLogger(__name__)


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
                opacity: 0.25;
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
