#!/usr/bin/env python3

import typing as t
import logging
import enum
import sys
import argparse
import tomllib

from badger.layer import Layer

log = logging.getLogger(__name__)


class EdgeText(Layer):
    def __init__(self, text: str, startOffset: float=0.0):
        self.text = text
        self.startOffset = startOffset

    def render(self) -> str:
        return f"""
            <text x="0" y="-1" font-size="2">
                <textPath
                    xlink:href="#edgeBorder"
                    method="stretch"
                    textLength="100%"
                    spacing="auto"
                    lengthAdjust="spacingAndGlyphs"
                    startOffset="{self.startOffset}%"
                >
                    {self.text}
                </textPath>
            </text>
        """
