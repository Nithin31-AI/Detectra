import networkx as nx


def calculate_metrics(edges: list[tuple[str, str]]) -> dict[str, object]:
    graph = nx.Graph()
    graph.add_edges_from(edges)
    return {"degree": dict(nx.degree_centrality(graph)), "betweenness": dict(nx.betweenness_centrality(graph)), "eigenvector": dict(nx.eigenvector_centrality(graph, max_iter=1_000)) if graph else {}, "communities": [sorted(group) for group in nx.connected_components(graph)]}
