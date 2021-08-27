#!/usr/bin/env bash

export CODE_BENCH_PATH="$(pwd)/out/bench"
export CODE_BENCH_FOLDER="$(pwd)/benchFixture"

node "$(pwd)/out/bench/runBench"
