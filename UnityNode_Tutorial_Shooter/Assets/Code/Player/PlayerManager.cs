using Project.Networking;
using Project.Utility;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Project.Player {
    public class PlayerManager : MonoBehaviour {

        const float BARREL_PIVOT_OFFSET = 90.0f;

        [Header("Data")]
        [SerializeField]
        private float speed = 2;
        [SerializeField]
        private float rotation = 60;

        [Header("Object References")]
        [SerializeField]
        private Transform barrelPivot;
        [SerializeField]
        private Transform bulletSpawnPoint;

        [Header("Class References")]
        [SerializeField]
        private NetworkIdentity networkIdentity;

        private float lastRotation;

        //Shooting
        private BulletData bulletData;
        private Cooldown shootingCooldown;

        public void Start() {
            shootingCooldown = new Cooldown(1);
            bulletData = new BulletData();
            bulletData.position = new Position();
            bulletData.direction = new Position();
        }

        public void Update () {
            if(networkIdentity.IsControlling()) {
                checkMovement();
                checkAiming();
                checkShooting();
            }
		}

        public float GetLastRotation() {
            return lastRotation;
        }

        public void SetRotation(float Value) {
            barrelPivot.rotation = Quaternion.Euler(0, 0, Value + BARREL_PIVOT_OFFSET);
        }

        private void checkMovement() {
            float horizontal = Input.GetAxis("Horizontal");
            float vertical = Input.GetAxis("Vertical");

            transform.position += -transform.up * vertical * speed * Time.deltaTime;
            transform.Rotate(new Vector3(0, 0, -horizontal * rotation * Time.deltaTime));
        }

        private void checkAiming() {
            Vector3 mousePosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
            Vector3 dif = mousePosition - transform.position;
            dif.Normalize();
            float rot = Mathf.Atan2(dif.y, dif.x) * Mathf.Rad2Deg;

            lastRotation = rot;

            barrelPivot.rotation = Quaternion.Euler(0, 0, rot + BARREL_PIVOT_OFFSET);
        }

        private void checkShooting() {
            shootingCooldown.CooldownUpdate();

            if(Input.GetMouseButton(0) && !shootingCooldown.IsOnCooldown()) {
                shootingCooldown.StartCooldown();

                //Define Bullet
                bulletData.activator = NetworkClient.ClientID;
                bulletData.position.x = bulletSpawnPoint.position.x.TwoDecimals();
                bulletData.position.y = bulletSpawnPoint.position.y.TwoDecimals();
                bulletData.direction.x = bulletSpawnPoint.up.x;
                bulletData.direction.y = bulletSpawnPoint.up.y;

                //Send Bullet
                networkIdentity.GetSocket().Emit("fireBullet", new JSONObject(JsonUtility.ToJson(bulletData)));
            }
        }
	}
}
