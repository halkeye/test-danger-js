pipeline {
  agent {
    docker {
      image 'node:10'
    }
  }

  options {
    timeout(time: 10, unit: 'MINUTES')
    ansiColor('xterm')
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }

    stage('Danger CI') {
      environment {
        DANGER_GITHUB_API_TOKEN = credentials('github-halkeye')
      }
      steps {
        sh 'npm run danger:ci'
      }
    }

    stage('Test') {
      steps {
        sh 'npm run test'
      }
    }
  }
}

