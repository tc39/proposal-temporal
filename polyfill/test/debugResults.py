#!/usr/bin/env python3

import json
import sys

def main(filename):
    with open(filename, "r") as fp:
        results = json.load(fp)

    for test in results:
        del test["contents"]
        del test["compiled"]

    with open(filename, "w") as fp:
        json.dump(results, fp, sort_keys=True, indent=4, separators=(',', ': '))


if __name__ == "__main__":
    main(sys.argv[1])
