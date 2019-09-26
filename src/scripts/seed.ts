import { createConnection } from 'typeorm';
import Todo from '../entity/Todo';

const NAMES = ['A', 'B', 'C'];

const start = async (): Promise<void> => {
  try {
    const connection = await createConnection();
    const promiseTodos: Promise<Todo>[] = [];
    NAMES.forEach(name => {
      const todo = new Todo();
      todo.name = name;
      const promiseTodo = connection.manager.save(todo);
      promiseTodos.push(promiseTodo);
    });
    await Promise.all(promiseTodos);
    // eslint-disable-next-line
    console.log('SUCCESS: database seeded');
    process.exit(0);
  } catch (err) {
    // eslint-disable-next-line
    console.log('ERROR: database seed failed');
    process.exit(1);
  }
};
start();
