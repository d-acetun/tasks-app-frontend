const backend = "http://localhost:3000";

export const getAllTasks = async () => {
  return await httpRequest({
    url: `${backend}/tasks`,
    method: "GET",
    body: {},
  });
};

export const createTask = async ({ title, description }) => {
  return await httpRequest({
    url: `${backend}/tasks`,
    method: "POST",
    body: { title, description },
  });
};

export const updateTask = async (id, newValues) => {
  if (!id) throw new Error("id is required");
  if (!newValues) throw new Error("newValues is required");
  return await httpRequest({
    url: `${backend}/tasks/${id}`,
    method: "PATCH",
    body: newValues,
  });
};

export const deleteTask = async (id) => {
  if (!id) throw new Error("id is required");
  return await httpRequest({
    url: `${backend}/tasks/${id}`,
    method: "DELETE",
    body: {},
  });
};

const httpRequest = async ({
  url = `${backend}/tasks`,
  method = "GET",
  body = {},
}) => {
  const httpOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (method !== "GET" && method !== "DELETE") {
    httpOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, httpOptions);
  if (!response.ok) {
    throw new Error(`${response.statusText} ${response.status}`);
  }
  return response.json();
};
