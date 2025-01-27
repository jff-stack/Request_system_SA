import { v4 as uuidv4 } from 'uuid';

export const saveRequests = (requests) => {
  localStorage.setItem('requests', JSON.stringify(requests));
};

export const loadRequests = () => {
  const requests = localStorage.getItem('requests');
  return requests ? JSON.parse(requests) : [];
};

export const createRequest = (request) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!currentUser) {
    throw new Error('User not authenticated');
  }

  const newRequest = {
    ...request,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    status: 'Pending',
    userId: currentUser.id,
    deletedByAdmin: false,
    deletedByUser: false
  };
  
  const requests = loadRequests();
  saveRequests([...requests, newRequest]);
  return newRequest;
};

export const updateRequestStatus = (id, status) => {
  const requests = loadRequests().map(request => 
    request.id === id ? { ...request, status } : request
  );
  saveRequests(requests);
  return requests;
};

export const adminDeleteRequest = (id) => {
  const requests = loadRequests().map(request => 
    request.id === id ? { ...request, deletedByAdmin: true } : request
  );
  saveRequests(requests);
  return requests;
};

export const userDeleteRequest = (id) => {
  const requests = loadRequests().map(request => 
    request.id === id ? { ...request, deletedByUser: true } : request
  );
  saveRequests(requests);
  return requests;
};