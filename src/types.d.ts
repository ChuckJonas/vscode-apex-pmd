interface PmdResult {
  problem: string;
  package: string;
  file: string;
  priority: string;
  line: string;
  description: string;
  ruleSet: string;
  rule: string;
  externalURL: string;
}

interface PmdReport {
  formatVersion: number;
  pmdVersion: string;
  timestamp: string;
  files: PmdFile[];
}

interface PmdFile {
  filename: string;
  violations: PmdViolation[];
}

interface PmdViolation {
  beginline: number;
  begincolumn: number;
  endline: number;
  endcolumn: number;
  description: string;
  rule: string;
  ruleset: string;
  priority: number;
  externalInfoUrl: string;
}
