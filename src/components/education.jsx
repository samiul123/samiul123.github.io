import { educations } from '../constants';
import Timeline from './Timeline';

export const Education = (props) => {
  const items = educations.map(edu => ({
    title: edu.institution,
    subtitle: edu.degree,
    date: edu.date,
    meta: edu.major,
    images: edu.images,
  }));

  return (
    <div id={props.id}>
      <Timeline items={items} label="Academic" title="EDUCATION" />
    </div>
  );
};
