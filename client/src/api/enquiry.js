import api from './index';

export const submitEnquiry = async (enquiryData) => {
  const { data } = await api.post('/enquiry', enquiryData);
  return data;
};