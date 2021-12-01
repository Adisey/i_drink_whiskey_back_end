

### Example .env
BACK_PORT=4000  
DB_DATABASE=test_2  
DB_URL=localhost  
DB_PORT=27017  
JWT_SECRET=SECRET  
UPLOAD_DIR=uploads  
IS_DEBUG_MODE=false  

### Example docker-compose.yml
version: "2.4"  

services:  
  backend:  
    image: adisey/i_drink_whiskey_back_end  
    container_name: whisky_backend  
    ports:  
      - 4000:4000  
    volumes:  
      - ./uploads:/usr/src/app/uploads  
    networks:  
      - back  
    depends_on:  
      db:  
        condition: service_healthy  
    environment:  
      - BACK_PORT=4000  
      - DB_URL=whisky_db  
      - DB_PORT=27017  
      - DB_DATABASE=test  
      - JWT_SECRET=SECRET  
      - UPLOAD_DIR=uploads  
      - IS_DEBUG_MODE=false 
  
networks:  
  back:  
    driver: bridge  

