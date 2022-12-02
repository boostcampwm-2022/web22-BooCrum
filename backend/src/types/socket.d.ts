import { ObjectMapVO } from 'src/socket/dto/object-map.vo';

declare type WorkspaceObjectMapper = {
  timeout: NodeJS.Timeout;
  objects: Map<string, ObjectMapVO>;
};
