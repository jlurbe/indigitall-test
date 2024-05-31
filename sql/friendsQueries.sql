-- Amigos del usuario con id 1
SELECT u.id, u.username 
FROM users u
INNER JOIN friendships f ON f.friend_id=u.id
WHERE f.user_id = 1

-- Número de amigos del usuario con id 1
SELECT count(*) as num_friends 
FROM friendships f
WHERE f.user_id = 1