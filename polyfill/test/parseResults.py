#!/usr/bin/env python3

import json
import sys

PREFIXES = [
    ["FAIL", "PASS"],
    ["EXPECTED FAIL", "UNEXPECTED PASS"],
]


def parse_expected_failures():
    expected_failures = set()
    with open("expected-failures.txt", "r") as fp:
        for line in fp:
            line = line.strip()
            if not line:
                continue
            if line.startswith("#"):
                continue
            expected_failures.add(line)
    return expected_failures


def main(filename):
    expected_failures = parse_expected_failures()
    with open(filename, "r") as fp:
        results = json.load(fp)

    unexpected_results = []
    for test in results:
        expected_failure = test["file"] in expected_failures
        actual_result = test["result"]["pass"]
        print("{} {}".format(PREFIXES[expected_failure][actual_result], test["file"]))
        if actual_result == expected_failure:
            if not actual_result:
                print(test["rawResult"]["stderr"])
                print(test["rawResult"]["stdout"])
                print(test["result"]["message"])
            unexpected_results.append(test)

    if unexpected_results:
        print("{} unexpected results:".format(len(unexpected_results)))
        for unexpected in unexpected_results:
            print("- {}".format(unexpected["file"]))
        return False

    print("All results as expected.")
    return True


if __name__ == "__main__":
    sys.exit(0 if main(sys.argv[1]) else 1)
