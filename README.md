# Node.js


# 구성
## migrations
node.js에서 sequelize를 이용해 MySQL을 제어함.

## models
플레이들이 입장하는 방의 정보를 database의 Room 테이블에 저장함. title column은 방의 제목이고 player1, player2 column은 해당 방 유저의 socket id를 저장함.

## public
AWS Load Balancer의 target group을 설정할 때 진행되는 health check를 위한 api를 생성.

## app.js
client요청에 따라 database를 CRUD처리 하는 api를 구현,

유저들 간의 통신을 socket.IO로 구현
