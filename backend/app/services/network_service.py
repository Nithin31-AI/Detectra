import networkx as nx

from app.schemas.network import Edge, NetworkMetrics


class NetworkAnalyticsService:
    @staticmethod
    def metrics(edges: list[Edge]) -> NetworkMetrics:
        graph = nx.Graph()
        graph.add_edges_from((edge.source, edge.target, {"weight": edge.weight}) for edge in edges)
        degree = nx.degree_centrality(graph)
        betweenness = nx.betweenness_centrality(graph, weight="weight", normalized=True)
        eigenvector = nx.eigenvector_centrality(graph, max_iter=1_000, weight="weight") if graph.number_of_nodes() else {}
        communities = [sorted(group) for group in nx.community.greedy_modularity_communities(graph)] if graph.number_of_edges() else [[node] for node in graph.nodes]
        return NetworkMetrics(degree=degree, betweenness=betweenness, eigenvector=eigenvector, communities=communities)
