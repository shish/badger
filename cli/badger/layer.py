#!/usr/bin/env python3

import typing as t
import logging
import enum
import sys
import argparse
import tomllib


log = logging.getLogger(__name__)


class Layer:
    canvas_size = 43
    cutter_size = 41
    visible_size = 34

    def render(self) -> str:
        ...
