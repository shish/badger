#!/usr/bin/env python3

import typing as t
import logging
import enum
import sys
import argparse
import tomllib

from badger.layer import Layer

log = logging.getLogger(__name__)


class HFlag(Layer):
    def __init__(self, stripes: t.List[t.Dict[str, int]]):
        self.stripes = stripes

    def render(self) -> str:
        svg = ""
        y = 0
        total = sum(stripe['size'] for stripe in self.stripes)
        for stripe in self.stripes:
            svg += f'<rect x="0" y="{self.canvas_size * y/total}" width="{self.canvas_size}" height="{self.canvas_size * stripe['size']/total}" fill="{stripe['color']}" />'
            y += stripe['size']
        return svg
