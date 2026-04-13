import { educations } from '../constants';
import Timeline from './Timeline';

const parseRangeStart = (date) => {
  const start = date.split(' - ')[0].trim();
  return start.toLowerCase() === 'present' ? Date.now() : new Date(start).getTime();
};

export const Education = (props) => {
  const items = [...educations]
    .sort((a, b) => parseRangeStart(b.date) - parseRangeStart(a.date))
    .map(edu => ({
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
