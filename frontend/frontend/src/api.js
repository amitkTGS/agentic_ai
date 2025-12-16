export const processExpense = async (file, employeeId) => {
  const form = new FormData();
  form.append("file", file);
  form.append("employee_id", employeeId);

  const res = await fetch("http://localhost:8000/process?employee_id=" + employeeId, {
    method: "POST",
    body: form,
  });

  return await res.json();
};
