kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml

kubectl apply -f dashboard-adminuser.yaml

echo ""
kubectl -n kubernetes-dashboard create token admin-user
echo ""

echo "http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/"

kubectl proxy

