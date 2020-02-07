# awk script for processing Markdown includes
/^{{.*}}$/ {
    file = substr($1, 3, length($1) - 4)
    while ((getline line < file) > 0)
        print line
    close(file)
}
! /^{{.*}}$/ { print }
