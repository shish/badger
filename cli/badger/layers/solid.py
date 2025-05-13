#!/usr/bin/env python3

import typing as t
import logging
import enum
import sys
import argparse
import tomllib

from badger.layer import Layer

log = logging.getLogger(__name__)


class Solid(Layer):
    def __init__(self, color: str):
        self.color = color

    def render(self) -> str:
        return f'<rect x="0" y="0" width="{self.canvas_size}" height="{self.canvas_size}" fill="{self.color}" />'
