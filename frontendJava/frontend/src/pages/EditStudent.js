import React from 'react';
import StudentList from "./components/StudentList";
import { useParams } from 'react-router-dom';

const EditStudent = () => {
  const { id } = useParams();

  return (
    <div>
      <h3>Öğrenci Güncelle - ID: {id}</h3>
    </div>
  );
};

export default EditStudent;
