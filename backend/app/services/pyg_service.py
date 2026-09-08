from pathlib import Path


class PyGLinkPredictionService:
    def load_checkpoint(self, checkpoint_path: str):
        import torch

        path = Path(checkpoint_path)
        if not path.is_file():
            raise FileNotFoundError(f"GNN checkpoint not found: {checkpoint_path}")
        return torch.load(path, map_location="cpu", weights_only=False)

    def build_data(self, node_features: list[list[float]], edges: list[tuple[int, int]]):
        import torch
        from torch_geometric.data import Data

        x = torch.tensor(node_features, dtype=torch.float32)
        edge_index = torch.tensor(edges, dtype=torch.long).t().contiguous()
        return Data(x=x, edge_index=edge_index)

    def predict_links(self, model, data, candidates):
        import torch

        model.eval()
        with torch.no_grad():
            embeddings = model.encode(data.x, data.edge_index) if hasattr(model, "encode") else model(data.x, data.edge_index)
            scores = torch.sigmoid((embeddings[candidates[:, 0]] * embeddings[candidates[:, 1]]).sum(dim=1))
        return scores.cpu().tolist()
