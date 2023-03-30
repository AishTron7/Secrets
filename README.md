# The Chamber of Secrets :closed_lock_with_key: [link](https://secrets-bfg5.onrender.com)#

## Concept: ##
A user after registering with this website OR signing up through google can submit their deepest secret with the world and thus reduce their cognitive burden. Since their identity will not be linked with their secret, no one can actually know about which secret was submitted by whom. Apart from reducing the burden of secret sharers, this website also serves as a source of entertainment and fascination as people read other people's secrets.

## Technology: ##
This website uses Node.js, Express.js and EJS to create a consistent look across all the pages without repeating the header & footer code. MongoDB is used to store all the secrets submitted by users and their login information. Now to understand how advanced security is implemented in this website, it is important to know some industry standards in security. We know that many developers store the passwords created by users in plain-text format in their database. This is a bad practice as any hacker who gets access to this databse, or any employee/partner who has access to the website's backend can see the passwords. A better approach is to encrypt the passwords, so even if somebody gets into the database they will only get encrypted passwords! But this is also vulnerable :( because if they manage to get the encryption key, they can decrypt all passwords found in the database with that key. The next best approach is to hash the passwords, which means that a hash will be generated for each password and will be stored in the database instead of the password. Now since we cannot decrypt a hash and go back to plaintext, there is no encryption key here. When the user logs in next time, their password is again converted to hash and matched with the stored password, if these two hashes match, the user logs in. This also means that even the website owner cannot see any user's password. It ensures that no hacker can access it. Or does it?

Well, now hackers exploit the fact that the hash for a certain password always remains same. So what they do is, they create a hash-table, which means they map the hashes found in a database to the most common passwords, like we know that some most common passwords are '123456', 'password' etc. and with millions of passwords leaked already (from previous breaches) available on the internet, a hacker can easily create a large hash table. The solution to this problem is 'salting'. Salting means to add a random text to the password before hashing, so every hash for the same password will be different. The random text (salt) is also stored along with the hash for each user in the database so that the user can still be authenticated next time. We can toughen this up by increasing the number of rounds of salting, so for example in two rounds of salting a random text will be added to the password, which will pass through the hashing algorithm, then again a random text will be added to that hash which will again pass through the hashing algorithm and so forth.

Coming to this site now, I have implemented ten rounds of salting and hashing of the passwords. Since the good vs evil fight is an eternal one, we now see some big security firms implementing something called 'peppering' with salting & more such measures.

One of the easiest ways for developers to remain safe from hackers without spending too much resources on security is by outsourcing the handling of passwords to big firms like google and facebook who have high level of security. This website also has the option of google sign-in. By this method, google verifies that the user is a legit member in their records & I don't have to store any hash or salt related to user. It is google's job now to secure the user's password (of user's google account) from hackers. Only the basic info like the user's name etc. is taken from google & the user's session is started. This is achieved using OAuth 2.0 library which is the de facto industry standard for online authorization and Passport.js which is also used here to create cookies & sessions so that the user can reopen the website and still can submit a secret without having to login again as long as he/she doesn't log out or the cookie created by the website in their browser doesn't expire.


## Aim of this project: ##
The major aims of this project are:-
* To demonstrate the usage of OAUTH 2.0 and sign-in through google
* To demonstrate the usage of passport library to create cookies & sessions
* To demonstrate the security measures such as hashing and salting of passwords.
* To demonstrate the usage of a No-SQL database such as MongoDB

Note: Authentication is not required for viewing secrets, it is required so that each user can submit only one secret. (To avoid spamming)

Hosting is done on Render and you can visit the site [here.](https://secrets-bfg5.onrender.com)
