import { createContext, useState, useContext } from 'react';
import * as api from '../services/api';
import { AuthContext } from './AuthContext';

export const ChartContext = createContext();

export const ChartProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [charts, setCharts] = useState([]);
  const [currentGuestChart, setCurrentGuestChart] = useState(null);

  const fetchCharts = async () => {
    if (!token) return;
    const data = await api.getCharts(token);
    setCharts(data);
  };

  const createChart = async (profileName, dateOfBirth) => {
    const newChart = await api.createChart(token, profileName, dateOfBirth);
    setCharts(prev => [...prev, newChart]);
    return newChart;
  };

  const deleteChart = async (id) => {
    await api.deleteChart(token, id);
    setCharts(prev => prev.filter(c => c._id !== id));
  };

  const generateGuestChart = async (profileName, dateOfBirth) => {
    try {
      const chart = await api.generateGuestChart(profileName, dateOfBirth);
      setCurrentGuestChart(chart);
      return chart;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const clearGuestChart = () => setCurrentGuestChart(null);

  return (
    <ChartContext.Provider value={{ charts, currentGuestChart, fetchCharts, createChart, deleteChart, generateGuestChart, clearGuestChart }}>
      {children}
    </ChartContext.Provider>
  );
};
