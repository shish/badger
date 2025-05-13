#!/usr/bin/env python3

import typing as t
import logging
import enum
import sys
import argparse
import tomllib

from badger.layer import Layer

log = logging.getLogger(__name__)

class Badge:
    def __init__(
        self,
        print_scale: float=1.0,
        layers: t.List[Layer]=[],
    ):
        self.id = id(self)
        self.canvas_size = 43
        self.cutter_size = 41
        self.visible_size = 34
        self.print_scale = print_scale
        self.layers = layers

    def render(self) -> str:
        inner = "\n        ".join(layer.render() for layer in self.layers)

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
    <g>
        {inner}
        <circle cx="{cx}" cy="{cy}" r="{big_r}" stroke="white" class="outsideCutter" stroke-width="{big_r_stroke}" fill="none" />
        <circle cx="{cx}" cy="{cy}" r="{small_r}" stroke="white" class="badgeSideArea" stroke-width="{small_r_stroke}" fill="none" />
        <circle cx="{cx}" cy="{cy}" r="{self.visible_size/2}" stroke="black" class="badgeSideMarker" stroke-width="0.5" stroke-dasharray="2,2" fill="none" id="edgeBorder" />
        <circle cx="{cx}" cy="{cy}" r="{self.cutter_size/2}" stroke="black" stroke-width="1" fill="none" />
    </g>
</svg>
"""
