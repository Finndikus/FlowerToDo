export interface Task {
  id: string;
  content: string;
  isCompleted: boolean;
  subtasks: Task[];
  isOpen: boolean;
  color?: string;
  icon?: string;
  effort?: "S" | "M" | "L";
  description?: string;
}

export interface TaskList {
  id: string;
  name: string;
  tasks: Task[];
}

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
}

export interface WeatherCondition {
  description: string;
  emoji: string;
}
