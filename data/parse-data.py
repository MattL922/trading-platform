with open("XSP_20140101_20141112.csv", "r") as fin:
  with open("XSP.json", "w") as fout:
    fin.readline()
    for line in fin.readlines():
      parts = line.split(",")
      date = parts[1]
      o = parts[2]
      h = parts[3]
      l = parts[4]
      c = parts[5]
      dateParts = date.split("-")
      date = "{0}-{1}-{2}".format(dateParts[2], dateParts[1], dateParts[0])
      fout.write('{{"date":"{0}", "open":"{1}", "high":"{2}", "low":"{3}", "close":"{4}"}},\n'.format(date, o, h, l, c))

