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
  ],
  volumes: [
    hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock'),
  ]
) {
  node(label) {
    def region = "us-west-2"

    try {
      build job: 'ui-private/cactus-771-sonarqube-poc', wait: false, parameters: [string(name: 'cactusBranch', value: env.BRANCH_NAME)]
    }
    catch (e) {
      currentBuild.result = 'FAILURE'
      throw e
    }
  }
}