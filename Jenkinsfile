def label = "worker-${UUID.randomUUID().toString()}"

podTemplate(
  label: label,
  containers: [
    containerTemplate(
      name: 'jnlp',
      image: 'jenkins/jnlp-slave:3.10-1-alpine',
      args: '${computer.jnlpmac} ${computer.name}',
      envVars: [
        envVar(key: 'BUILD_NUMBER'         , value: "${env.BUILD_NUMBER}"     ),
        envVar(key: 'JENKINS_TUNNEL', value: 'jenkins-agent:50000'         ),
        envVar(key: 'JENKINS_URL'   , value: 'http://jenkins-internal:8080'),
      ]
    ),
    containerTemplate(
      name: 'techdocs-cli',
      image: "232624534379.dkr.ecr.us-west-2.amazonaws.com/repay-techdocs:6b23edce797a1b8ac21072d7f8252f879d13f23f",
      ttyEnabled: true,
      command: 'cat',
      alwaysPullImage: true,
      envVars: [
        secretEnvVar(key: 'AWS_ACCESS_KEY_ID', secretName: 'backstage-techdocs-iam', secretKey: 'aws_access_key_id'),
        secretEnvVar(key: 'AWS_SECRET_ACCESS_KEY', secretName: 'backstage-techdocs-iam', secretKey: 'aws_secret_access_key'),
      ],
    ),
    containerTemplate(
      name: 'repay-cli',
      image: "232624534379.dkr.ecr.us-west-2.amazonaws.com/repay-cli:v1",
      ttyEnabled: true,
      command: 'cat',
      alwaysPullImage: true,
      envVars: [
        secretEnvVar(key: 'GITHUB_TOKEN', secretName: 'github', secretKey: 'github_password'),
      ],
    ),
  ],
  volumes: [
    hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock'),
  ]
) {
  node(label) {
    def region = "us-west-2"

    checkout scm

    try {
      stage('generate-and-publish-docs') {
        container('techdocs-cli') {
          sh """
              techdocs-cli generate --no-docker --output-dir ./workspace/techdocs
              techdocs-cli publish --publisher-type awsS3 --storage-name backstage-techdocs-org --entity default/group/ui-team --directory ./workspace/techdocs
              techdocs-cli publish --publisher-type awsS3 --storage-name backstage-techdocs-org --entity default/component/cactus-fwk --directory ./workspace/techdocs
              techdocs-cli publish --publisher-type awsS3 --storage-name backstage-techdocs-org --entity default/component/cactus-i18n --directory ./workspace/techdocs
              techdocs-cli publish --publisher-type awsS3 --storage-name backstage-techdocs-org --entity default/component/cactus-theme --directory ./workspace/techdocs
              techdocs-cli publish --publisher-type awsS3 --storage-name backstage-techdocs-org --entity default/component/cactus-web --directory ./workspace/techdocs
          """
          }
      }

      stage('publish-backstage-catalog') {
        container('repay-cli') {
          sh "repay backstage add github.com/repaygithub/cactus"
        }
      }
    }
    catch (e) {
      currentBuild.result = 'FAILURE'
      throw e
    }
  }
}