#!/bin/bash

yarn w standard test:ci && yarn w theme-components test:ci && yarn w mock-ebpp test:ci
