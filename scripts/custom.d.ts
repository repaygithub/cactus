declare module '@lerna/describe-ref' {
  interface DescribeResults {
    lastTagName: string
    lastVersion: string
    refCount: string
    sha: string
    isDirty: boolean
  }
  const describe: () => Promise<DescribeResults>
  export default describe
}
