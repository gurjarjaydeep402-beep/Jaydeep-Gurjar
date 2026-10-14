export interface CommitItem {
  id: string;
  message: string;
  author: string;
  timestamp: number;
  branch: string;
  filesChanged: number;
  hash: string;
  tags?: string[];
  diffPreview?: string;
}

export interface BranchItem {
  name: string;
  isDefault: boolean;
  lastCommitHash: string;
  updatedAt: number;
}

export interface ProjectVersionState {
  currentBranch: string;
  branches: BranchItem[];
  commits: CommitItem[];
  stagedFiles: string[];
}
