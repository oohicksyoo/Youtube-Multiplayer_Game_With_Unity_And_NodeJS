using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Project.AI {
	public class AIManager : MonoBehaviour {
		
		const float BARREL_PIVOT_OFFSET = 90.0f;
		
		[SerializeField]
		private Transform tankTransform;

		[SerializeField]
		private Transform barrelTransform;

		private Coroutine tankRotationCoroutine;
		
		public void SetBarrelRotation(float value) {
			barrelTransform.localEulerAngles = new Vector3(0, 0, value + BARREL_PIVOT_OFFSET);
		}

		public void SetTankRotation(float value) {
			tankRotationCoroutine = StartCoroutine(AnimateTankTurn(tankTransform.localEulerAngles.z, value + BARREL_PIVOT_OFFSET));
		}

		public void StopCoroutines() {
			if (tankRotationCoroutine != null) {
				StopCoroutine(tankRotationCoroutine);
			}
		}

		private IEnumerator AnimateTankTurn(float startRotation, float goalRotation) {
			float count = 0.1f; //In sync with server update
			float currentTime = 0.0f;

			while (currentTime < count) {
				currentTime += Time.deltaTime;

				if (currentTime < count) {
					tankTransform.localEulerAngles = new Vector3(0, 0,
						Mathf.LerpAngle(startRotation, goalRotation, currentTime / count));
				}

				yield return new WaitForEndOfFrame();
				
				if (tankTransform == null) {
					currentTime = count;
					yield return null;
				}
			}

			yield return null;
		}
	}
}

