 
export function getLocalDepartments() {
  const LOCAL_KEY = 'departamentos_local';
  let departamentos = [];
  const local = localStorage.getItem(LOCAL_KEY);
  if (local) {
    departamentos = JSON.parse(local);
  } else {
    
    departamentos = require('./departments.json');
    localStorage.setItem(LOCAL_KEY, JSON.stringify(departamentos));
  }
  return departamentos;
}

 
export function addLocalDepartment(depto) {
  const LOCAL_KEY = 'departamentos_local';
  let departamentos = getLocalDepartments();
  const newId = departamentos.length > 0 ? Math.max(...departamentos.map(d => d.id || 0)) + 1 : 1;
  departamentos.push({ ...depto, id: newId });
  localStorage.setItem(LOCAL_KEY, JSON.stringify(departamentos));
  return departamentos;
}

 
export function deleteLocalDepartment(id) {
  const LOCAL_KEY = 'departamentos_local';
  let departamentos = getLocalDepartments();
  departamentos = departamentos.filter(d => d.id !== id);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(departamentos));
  return departamentos;
}

 
export async function fetchDepartmentsAPI() {
  return getLocalDepartments();
}

export async function addDepartmentAPI(depto) {
  return addLocalDepartment(depto);
}

export async function deleteDepartmentAPI(id) {
  return deleteLocalDepartment(id);
}
