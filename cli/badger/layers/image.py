#!/usr/bin/env python3

import typing as t
import logging
import enum
import sys
import argparse
import tomllib

from badger.layer import Layer

log = logging.getLogger(__name__)



class Image(Layer):
    def __init__(
        self,
        image: str,
        offset: t.Tuple[int, int] = (0, 0),
        scale: float=1.0,
    ):
        self.image = image
        self.offset = offset
        self.scale = scale

    def render(self) -> str:
        centre = self.canvas_size / 2
        img_size = self.canvas_size * self.scale
        img_offset = (
            (centre - img_size / 2) + self.offset[0],
            (centre - img_size / 2) + self.offset[1]
        )
        return f'<image href="{self.image}" x="{img_offset[0]}" y="{img_offset[1]}" width="{img_size}" height="{img_size}" />'
