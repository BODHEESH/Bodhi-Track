const devOpsData = [
    {
        week: "Week 1: Azure & Infrastructure Basics",
        goal: "Get familiar with Azure, Terraform, Ansible, and YAML basics",
        topics: [
            {
                day: 1,
                title: "Introduction to Azure",
                subtopics: [
                    "Azure services overview",
                    "Azure App Services, VMs, Storage, Networking",
                    "Azure DevOps basics"
                ],
                status: "todo"
            },
            {
                day: 2,
                title: "Azure Resource Management",
                subtopics: [
                    "Azure Resource Manager (ARM)",
                    "Azure Key Vault",
                    "Azure Storage & Networking"
                ],
                status: "todo"
            },
            {
                day: 3,
                title: "Introduction to Terraform (IaC)",
                subtopics: [
                    "What is Terraform & why use it?",
                    "Installing Terraform",
                    "Writing your first .tf file"
                ],
                status: "todo"
            },
            {
                day: 4,
                title: "Terraform Fundamentals",
                subtopics: [
                    "Terraform Providers & Modules",
                    "Terraform State Management",
                    "Terraform Variables & Outputs"
                ],
                status: "todo"
            },
            {
                day: 5,
                title: "Ansible Basics",
                subtopics: [
                    "What is Ansible?",
                    "Installing Ansible",
                    "Writing your first Ansible Playbook"
                ],
                status: "todo"
            },
            {
                day: 6,
                title: "YAML for DevOps",
                subtopics: [
                    "Introduction to YAML",
                    "Writing YAML files",
                    "YAML syntax for CI/CD Pipelines"
                ],
                status: "todo"
            },
            {
                day: 7,
                title: "Hands-on Practice Day",
                subtopics: [
                    "Set up an Azure Resource using Terraform",
                    "Write a simple Ansible playbook",
                    "Practice writing YAML files"
                ],
                status: "todo"
            }
        ]
    },
    {
        week: "Week 2: Containerization & CI/CD",
        goal: "Learn Docker, Kubernetes, and CI/CD with Jenkins & Azure Pipelines",
        topics: [
            {
                day: 8,
                title: "Docker Basics",
                subtopics: [
                    "What is Docker?",
                    "Installing Docker",
                    "Running containers & writing Dockerfiles"
                ],
                status: "todo"
            },
            {
                day: 9,
                title: "Docker Networking & Volumes",
                subtopics: [
                    "Docker Compose",
                    "Data persistence with Volumes",
                    "Networking in Docker"
                ],
                status: "todo"
            },
            {
                day: 10,
                title: "Kubernetes Introduction",
                subtopics: [
                    "What is Kubernetes?",
                    "Setting up Minikube/Kubernetes Cluster",
                    "Understanding Pods, Deployments, and Services"
                ],
                status: "todo"
            },
            {
                day: 11,
                title: "Kubernetes Configuration",
                subtopics: [
                    "ConfigMaps & Secrets",
                    "Ingress Controllers",
                    "StatefulSets vs Deployments"
                ],
                status: "todo"
            },
            {
                day: 12,
                title: "CI/CD with Jenkins",
                subtopics: [
                    "Jenkins setup",
                    "Writing Jenkins pipelines",
                    "Integrating Jenkins with Docker"
                ],
                status: "todo"
            },
            {
                day: 13,
                title: "CI/CD with Azure DevOps",
                subtopics: [
                    "Azure Pipelines overview",
                    "Writing a CI/CD pipeline in YAML",
                    "Running pipeline for a sample application"
                ],
                status: "todo"
            },
            {
                day: 14,
                title: "Hands-on Practice Day",
                subtopics: [
                    "Deploy an app using Docker & Kubernetes",
                    "Create a Jenkins pipeline to build & deploy a container"
                ],
                status: "todo"
            }
        ]
    },
    {
        week: "Week 3: Monitoring & Security",
        goal: "Explore monitoring tools like Grafana, Prometheus, and ELK stack",
        topics: [
            {
                day: 15,
                title: "Introduction to Prometheus",
                subtopics: [
                    "What is Prometheus?",
                    "Installing Prometheus",
                    "Writing PromQL queries"
                ],
                status: "todo"
            },
            {
                day: 16,
                title: "Setting up Grafana for Monitoring",
                subtopics: [
                    "What is Grafana?",
                    "Installing & Configuring Grafana",
                    "Connecting Grafana with Prometheus"
                ],
                status: "todo"
            },
            {
                day: 17,
                title: "Working with Alerts in Grafana & Prometheus",
                subtopics: [
                    "Configuring Alerting in Prometheus",
                    "Setting up Alert Rules in Grafana"
                ],
                status: "todo"
            },
            {
                day: 18,
                title: "Introduction to ELK Stack",
                subtopics: [
                    "What is ELK? (Elasticsearch, Logstash, Kibana)",
                    "Installing the ELK stack",
                    "Basic log collection with Logstash"
                ],
                status: "todo"
            },
            {
                day: 19,
                title: "Monitoring Kubernetes with ELK",
                subtopics: [
                    "Setting up Fluentd with ELK",
                    "Creating visualizations in Kibana"
                ],
                status: "todo"
            },
            {
                day: 20,
                title: "Security in CI/CD & Cloud",
                subtopics: [
                    "Best practices for securing DevOps pipelines",
                    "Role-Based Access Control (RBAC) in Kubernetes",
                    "Using Azure Key Vault & secrets management"
                ],
                status: "todo"
            },
            {
                day: 21,
                title: "Hands-on Practice Day",
                subtopics: [
                    "Configure Grafana dashboards",
                    "Set up monitoring for a Kubernetes cluster"
                ],
                status: "todo"
            }
        ]
    },
    {
        week: "Week 4: Advanced Topics & Real-World Projects",
        goal: "Apply your knowledge with real-world deployments and automation",
        topics: [
            {
                day: 22,
                title: "Writing Advanced Terraform Modules",
                subtopics: [
                    "Terraform Remote State",
                    "Using Terraform with Azure DevOps"
                ],
                status: "todo"
            },
            {
                day: 23,
                title: "Automating Infrastructure with Ansible",
                subtopics: [
                    "Writing Advanced Ansible Playbooks",
                    "Automating Azure resource provisioning"
                ],
                status: "todo"
            },
            {
                day: 24,
                title: "Kubernetes Helm Charts",
                subtopics: [
                    "What is Helm?",
                    "Writing and deploying Helm charts"
                ],
                status: "todo"
            },
            {
                day: 25,
                title: "CI/CD Pipeline for Kubernetes Apps",
                subtopics: [
                    "Deploying apps using GitHub Actions & Azure Pipelines",
                    "Automating deployments with Helm"
                ],
                status: "todo"
            },
            {
                day: 26,
                title: "Logging & Monitoring in CI/CD",
                subtopics: [
                    "Setting up ELK for application logs",
                    "Centralized monitoring with Grafana"
                ],
                status: "todo"
            },
            {
                day: 27,
                title: "Cloud Deployment Best Practices",
                subtopics: [
                    "Blue-Green & Canary Deployments",
                    "Implementing Auto-Scaling in Kubernetes"
                ],
                status: "todo"
            },
            {
                day: 28,
                title: "Troubleshooting & Debugging in DevOps",
                subtopics: [
                    "Debugging CI/CD pipelines",
                    "Troubleshooting Kubernetes deployments"
                ],
                status: "todo"
            },
            {
                day: 29,
                title: "Final Hands-on Project",
                subtopics: [
                    "Deploy a sample app with CI/CD using Terraform",
                    "Deploy with Ansible",
                    "Deploy to Kubernetes",
                    "Use Docker",
                    "Integrate with Jenkins"
                ],
                status: "todo"
            },
            {
                day: 30,
                title: "Review & Mock Interview",
                subtopics: [
                    "Revise all topics",
                    "Prepare interview questions",
                    "Take a mock interview"
                ],
                status: "todo"
            }
        ]
    }
];

module.exports = devOpsData;
