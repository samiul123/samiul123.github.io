import { contributions } from '../../constants';

test('contributions has at least one entry with required fields', () => {
  expect(contributions.length).toBeGreaterThan(0);
  const first = contributions[0];
  expect(first).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      repo: expect.any(String),
      repoUrl: expect.any(String),
      prTitle: expect.any(String),
      prUrl: expect.any(String),
      date: expect.any(String),
      status: expect.stringMatching(/^(merged|open|closed)$/),
      tags: expect.any(Array),
      description: expect.any(String),
    })
  );
});
