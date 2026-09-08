from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class RagAnswer:
    answer: str
    citations: list[dict[str, str]]
    confidence: float


class Neo4jRagService:
    def __init__(self, neo4j_uri: str, neo4j_username: str, neo4j_password: str) -> None:
        from langchain_neo4j import Neo4jGraph

        self.graph = Neo4jGraph(url=neo4j_uri, username=neo4j_username, password=neo4j_password)

    def ask(self, question: str) -> RagAnswer:
        from langchain.chains import GraphCypherQAChain
        from langchain_openai import ChatOpenAI

        chain = GraphCypherQAChain.from_llm(llm=ChatOpenAI(temperature=0), graph=self.graph, allow_dangerous_requests=False)
        result = chain.invoke({"query": question})
        answer = str(result.get("result", result))
        return RagAnswer(answer=answer, citations=[{"source_type": "neo4j", "source_id": "knowledge-graph", "excerpt": answer[:500]}], confidence=0.75)
