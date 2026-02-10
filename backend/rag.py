import chromadb
from sentence_transformers import SentenceTransformer

# Initialize Chroma
client = chromadb.Client(
    chromadb.config.Settings(
        persist_directory="./chroma_db"
    )
)

embedder = SentenceTransformer("all-MiniLM-L6-v2")

policy_collection = client.get_or_create_collection("expense_policies")
expense_collection = client.get_or_create_collection("historical_expenses")


def embed_text(text: str):
    return embedder.encode([text]).tolist()


def store_policy(text: str, policy_id: str):
    policy_collection.add(
        documents=[text],
        embeddings=embed_text(text),
        ids=[policy_id]
    )


def retrieve_policy_context(query: str, k=3):
    results = policy_collection.query(
        query_embeddings=embed_text(query),
        n_results=k
    )
    return results["documents"][0] if results["documents"] else []


def store_expense_embedding(expense_id: int, ocr_text: str, metadata: dict):
    expense_collection.add(
        documents=[ocr_text],
        embeddings=embed_text(ocr_text),
        metadatas=[metadata],
        ids=[str(expense_id)]
    )


def semantic_duplicate_score(ocr_text: str):
    results = expense_collection.query(
        query_embeddings=embed_text(ocr_text),
        n_results=5
    )
    
    distances = results.get("distances", [])

    if not distances or not distances[0]:
        return 0.0

    return max(distances[0])
