export async function getData() {
  const res = await fetch("http://localhost:3004/works", {
    next: { revalidate: 0 },
  });
  const data = await res.json();

  return data;
}

export async function updateData(data: any, id: number) {
  const res = await fetch(`http://localhost:3004/works/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res;
}
