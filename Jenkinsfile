pipeline {
    agent any

    stages {
        stage('Pull Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                sh 'docker build -t karan56op/lab-practical:latest .'
            }
        }

        stage('Push Image') {
            steps {
                sh 'docker push karan56op/lab-practical:latest'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker rm -f my-web-app || true'
                sh 'docker run -d --name my-web-app -p 8080:80 --restart unless-stopped karan56op/lab-practical:latest'
            }
        }
    }
}
